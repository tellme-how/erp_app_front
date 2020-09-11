// 导入自己需要的组件
import { Tree } from 'element-ui'
import { Card } from 'element-ui'
import { Divider } from 'element-ui'
const element = {
	install: function(Vue) {
		Vue.use(Tree)
		Vue.use(Card)
		Vue.use(Divider)

	}
}
export default element