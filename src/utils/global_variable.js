/*
 * 公工参数 -- 孟鹏飞
	2020-07-30

	调用方式 : 
  this.$GLOBAL.XXXX
  
  * 
  * */
const htmlUrl = 'http://192.168.85.87:9010/pic/'
//const htmlUrl = 'http://218.25.137.122:9010/pic/'
const editorOption = {
	placeholder: '请输入内容',
	modules: {
		toolbar: [
			['bold'], //加粗
			[{ 'color': [] }], 
			[{
				align: []
			}], //对齐方式
		]
	}
}
const editorOptionNull = {
	placeholder: '请输入内容',
	modules: {
		toolbar: null
	}
}
export default {
	htmlUrl,
	//富文本
	editorOption,
	editorOptionNull,
}