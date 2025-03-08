<!--
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-05 14:06:18
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-05 14:06:26
 * @FilePath: \vite11\src\components\TabBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<style>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
  text-decoration: none;
  padding: 4px 0;
  transition: all 0.3s ease;
}

.tab-item.active {
  color: #1890ff;
}

.tab-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.tab-label {
  line-height: 1.2;
}
</style> 