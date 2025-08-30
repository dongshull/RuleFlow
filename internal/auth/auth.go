package auth

import (
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
	"github.com/rs/zerolog/log"
	
	"USG-LEGO/internal/database"
)

// PathRules 定义公共和私有路径规则
type PathRules struct {
	Public  []string `yaml:"public"`
	Private []string `yaml:"private"`
}

var pathRules PathRules

// IsPublic 检查路径是否为公共路径
func IsPublic(path string) bool {
	cleanPath := filepath.Clean(path)
	
	// 检查是否匹配公共路径规则
	for _, pattern := range pathRules.Public {
		matched, err := filepath.Match(pattern, cleanPath)
		if err != nil {
			log.Warn().Err(err).Str("pattern", pattern).Str("path", cleanPath).Msg("Invalid path pattern")
			continue
		}
		if matched {
			return true
		}
		
		// 检查是否为前缀匹配
		if strings.HasSuffix(pattern, "/**") {
			prefix := strings.TrimSuffix(pattern, "/**")
			if strings.HasPrefix(cleanPath, prefix) {
				return true
			}
		}
	}
	
	return false
}

// InitAuth 初始化认证模块
func InitAuth(rootDir string) {
	// 初始化数据库
	if err := database.InitDB(rootDir); err != nil {
		log.Error().Err(err).Msg("Failed to initialize database")
	}
	
	configPath := filepath.Join(rootDir, ".usg-lego.yml")
	
	// 检查配置文件是否存在
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Warn().Str("configPath", configPath).Msg("Config file not found, using default rules")
		// 使用默认规则
		pathRules = PathRules{
			Public:  []string{"/public/**"},
			Private: []string{"*"},
		}
		return
	}
	
	// 读取配置文件
	data, err := os.ReadFile(configPath)
	if err != nil {
		log.Error().Err(err).Str("configPath", configPath).Msg("Failed to read config file")
		return
	}
	
	// 解析YAML配置
	if err := yaml.Unmarshal(data, &pathRules); err != nil {
		log.Error().Err(err).Str("configPath", configPath).Msg("Failed to parse config file")
		return
	}
	
	log.Info().Interface("rules", pathRules).Msg("Loaded path rules from config")
}