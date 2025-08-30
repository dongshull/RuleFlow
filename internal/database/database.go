package database

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/rs/zerolog/log"
	_ "github.com/mattn/go-sqlite3"
)

// DB 数据库实例
var DB *sql.DB

// APIKey API密钥结构体
type APIKey struct {
	ID        int       `json:"id"`
	Token     string    `json:"token"`
	Note      string    `json:"note"`
	CreatedAt time.Time `json:"created_at"`
}

// InitDB 初始化数据库连接
func InitDB(rootDir string) error {
	// 创建数据库文件路径
	dbPath := filepath.Join(rootDir, "usg-lego.db")
	
	// 打开数据库连接
	var err error
	DB, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Error().Err(err).Str("dbPath", dbPath).Msg("Failed to open database")
		return err
	}
	
	// 测试连接
	if err := DB.Ping(); err != nil {
		log.Error().Err(err).Msg("Failed to ping database")
		return err
	}
	
	// 创建表
	if err := createTables(); err != nil {
		log.Error().Err(err).Msg("Failed to create tables")
		return err
	}
	
	// 检查是否需要初始化默认数据
	if err := initDefaultData(); err != nil {
		log.Error().Err(err).Msg("Failed to initialize default data")
		return err
	}
	
	log.Info().Str("dbPath", dbPath).Msg("Database initialized successfully")
	return nil
}

// createTables 创建必要的表
func createTables() error {
	// 创建API密钥表
	query := `
	CREATE TABLE IF NOT EXISTS api_keys (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		token TEXT UNIQUE NOT NULL,
		note TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`
	
	_, err := DB.Exec(query)
	if err != nil {
		log.Error().Err(err).Msg("Failed to create api_keys table")
		return err
	}
	
	return nil
}

// initDefaultData 初始化默认数据
func initDefaultData() error {
	// 检查是否已有API密钥
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM api_keys").Scan(&count)
	if err != nil {
		return err
	}
	
	// 如果没有API密钥，则创建默认密钥
	if count == 0 {
		// 从环境变量获取API密钥
		envAPIKey := os.Getenv("API_KEY")
		if envAPIKey != "" {
			// 使用环境变量中的API密钥
			if _, err := CreateAPIKey(envAPIKey, "Production API Key"); err != nil {
				return err
			}
		} else {
			// 创建默认的测试密钥
			defaultKeys := []struct {
				token string
				note  string
			}{
				{"test-key", "Default test key"},
				{"2ae5ac125e7ce03c91", "Generated 9-character key"},
				{"1c5ba23c", "Generated 8-character key"},
			}
			
			for _, key := range defaultKeys {
				if _, err := CreateAPIKey(key.token, key.note); err != nil {
					return err
				}
			}
		}
		
		log.Info().Msg("Initialized default API keys")
	}
	
	return nil
}

// ValidateAPIKey 验证API密钥
func ValidateAPIKey(token string) bool {
	var id int
	query := "SELECT id FROM api_keys WHERE token = ?"
	err := DB.QueryRow(query, token).Scan(&id)
	if err != nil {
		if err != sql.ErrNoRows {
			log.Error().Err(err).Str("token", token).Msg("Database error while validating API key")
		}
		return false
	}
	
	return true
}

// CreateAPIKey 创建新的API密钥
func CreateAPIKey(token, note string) (*APIKey, error) {
	// 如果没有提供token，则生成一个新的
	if token == "" {
		bytes := make([]byte, 16)
		if _, err := rand.Read(bytes); err != nil {
			return nil, err
		}
		token = hex.EncodeToString(bytes)
	}
	
	// 插入数据库
	query := "INSERT INTO api_keys (token, note, created_at) VALUES (?, ?, ?)"
	result, err := DB.Exec(query, token, note, time.Now())
	if err != nil {
		log.Error().Err(err).Str("token", token).Msg("Failed to insert API key")
		return nil, err
	}
	
	// 获取插入的ID
	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	
	// 返回创建的API密钥
	apiKey := &APIKey{
		ID:        int(id),
		Token:     token,
		Note:      note,
		CreatedAt: time.Now(),
	}
	
	log.Info().Int("id", apiKey.ID).Str("token", token).Msg("Created new API key")
	return apiKey, nil
}

// GetAPIKeys 获取所有API密钥
func GetAPIKeys() ([]*APIKey, error) {
	query := "SELECT id, token, note, created_at FROM api_keys ORDER BY created_at DESC"
	rows, err := DB.Query(query)
	if err != nil {
		log.Error().Err(err).Msg("Failed to query API keys")
		return nil, err
	}
	defer rows.Close()
	
	var apiKeys []*APIKey
	for rows.Next() {
		apiKey := &APIKey{}
		if err := rows.Scan(&apiKey.ID, &apiKey.Token, &apiKey.Note, &apiKey.CreatedAt); err != nil {
			return nil, err
		}
		apiKeys = append(apiKeys, apiKey)
	}
	
	return apiKeys, nil
}

// DeleteAPIKey 删除指定ID的API密钥
func DeleteAPIKey(id int) error {
	query := "DELETE FROM api_keys WHERE id = ?"
	result, err := DB.Exec(query, id)
	if err != nil {
		log.Error().Err(err).Int("id", id).Msg("Failed to delete API key")
		return err
	}
	
	// 检查是否有行被删除
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rowsAffected == 0 {
		return fmt.Errorf("API key with id %d not found", id)
	}
	
	log.Info().Int("id", id).Msg("Deleted API key")
	return nil
}

// GetAPIKeyByID 根据ID获取API密钥
func GetAPIKeyByID(id int) (*APIKey, error) {
	query := "SELECT id, token, note, created_at FROM api_keys WHERE id = ?"
	apiKey := &APIKey{}
	err := DB.QueryRow(query, id).Scan(&apiKey.ID, &apiKey.Token, &apiKey.Note, &apiKey.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("API key with id %d not found", id)
		}
		return nil, err
	}
	
	return apiKey, nil
}