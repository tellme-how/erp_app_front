<template>
    <div>
        <erpVanCellTitle title="附件">
			<van-button @click="showThree = !showThree;showThree ? showName3 ='收起明细' : showName3 = '展开明细'" size="mini" plain type="primary">{{showName3}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showThree" :linesList="linesList3" :widthTable="widthTable3"></lineTable>
    </div>
</template>
<script>

export default {
    components: {
    },
    props: {
        voucherId:String
    },
    data(){
        return{
            showName3 :'展开明细',
            enclosureTableData: [],
            widthTable3: 100,
            showThree: false,
            linesList3: [{
                name: "附件",
                value: "name",
                list: []
            },],
        }
    },

    methods: {
        /**
         * 查看附件列表
         * @param data
         */
        showFileData(data){
            let formDataA ={};
            let creator = localStorage.getItem('ms_staffId');
            formDataA.voucherId = data;
            this.$api.myDesk.findInfosList(formDataA).then(response => {
            	this.enclosureTableData = []
                if (response.data.data) {
                    let values = response.data.data;
                    let flag = true;
                    for(var i= 0;i<values.length;i++){
                        let attachment = values[i];
                            let file = {
                                rowNum: this.rowNum,
                                name: attachment.fileName,
                                id: attachment.id,
                                fullPath:attachment.fullPath,
                                fileSize:attachment.fileSize,
                            };
						console.log(attachment)
							var fileArray = [];
							fileArray.unshift(file);
							for(var i=0;i<fileArray.length;i++) {
								this.linesList3[0].list.push(fileArray[i].name);
							}
                            this.rowNum += 1;
					}
					var lines3 = this.linesList3[0].list.length;
					this.widthTable3 = lines3.length * 40 + 40
                } else {
                    this.$message.error(response.data.msg);
                }
            });
        },
    },
    watch:{
        voucherId: {
            handler:function(val,oldval){
                if(this.voucherId){
                    this.showFileData(this.voucherId)
                }
            },
            deep:true//对象内部的属性监听，也叫深度监听
        }
    },
    created(){
        if(this.voucherId){
            this.showFileData(this.voucherId)
        } else {
            this.linesList3[0].list.push('附件');
            this.widthTable3 = 1 * 40 + 40
        }
    }
}
</script>
