package routes

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	
	"USG-LEGO/internal/config"
	"USG-LEGO/internal/database"
	"USG-LEGO/internal/files"
)

// RegisterRoutes 注册所有路由
func RegisterRoutes(router *gin.Engine, cfg *config.Config) {
	// 健康检查接口
	router.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})
	
	// 文件相关接口
	api := router.Group("/api")
	{
		api.GET("/files", files.GetFile)
		
		// API密钥管理接口
		api.GET("/keys", getAPIKeys)
		api.POST("/keys", createAPIKey)
		api.DELETE("/keys/:id", deleteAPIKey)
	}
	
	// 原始文件访问接口
	router.GET("/raw/*path", func(c *gin.Context) {
		// 这里应该实现原始文件访问逻辑
		c.String(http.StatusOK, "Raw file access placeholder")
	})
}

// getAPIKeys 获取所有API密钥
func getAPIKeys(c *gin.Context) {
	// 验证管理员权限（简化实现，实际应使用更复杂的认证机制）
	adminKey := c.Query("api")
	if adminKey == "" || !database.ValidateAPIKey(adminKey) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or missing API key"})
		return
	}
	
	keys, err := database.GetAPIKeys()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve API keys"})
		return
	}
	
	c.JSON(http.StatusOK, keys)
}

// createAPIKey 创建新的API密钥
func createAPIKey(c *gin.Context) {
	// 验证管理员权限
	adminKey := c.Query("api")
	if adminKey == "" || !database.ValidateAPIKey(adminKey) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or missing API key"})
		return
	}
	
	// 解析请求体
	var req struct {
		Token string `json:"token"`
		Note  string `json:"note"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	
	// 创建API密钥
	key, err := database.CreateAPIKey(req.Token, req.Note)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create API key"})
		return
	}
	
	c.JSON(http.StatusOK, key)
}

// deleteAPIKey 删除API密钥
func deleteAPIKey(c *gin.Context) {
	// 验证管理员权限
	adminKey := c.Query("api")
	if adminKey == "" || !database.ValidateAPIKey(adminKey) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or missing API key"})
		return
	}
	
	// 获取ID参数
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID parameter"})
		return
	}
	
	// 删除API密钥
	if err := database.DeleteAPIKey(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "API key deleted successfully"})
}