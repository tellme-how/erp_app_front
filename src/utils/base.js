/*
 * 公共方法 -- 孟鹏飞
	2020-07-30

	调用方式 : 
	 this.XXXX()
  
  * 
  * */

export default {
	install(Vue, options) {
		//警告框弹出
		Vue.prototype.goOut = function(error) {
			this.$notify({ type: 'danger', message: error });
		};
		//警告框弹出
		Vue.prototype.goOut2 = function(error) {
			this.$message({
				showClose: true,
				message: error,
				type: 'error',
				duration: 0
			});
		};
		//成功框弹出
		Vue.prototype.goOk = function(success) {
			this.$notify({ type: 'success', message: success });
		};
		Vue.prototype.dateValue = function(dateValue, state) {
			function formatTen(num) {
				return num > 9 ? (num + "") : ("0" + num);
			}

			function formatDate(date) {
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var hour = date.getHours();
				var minute = date.getMinutes();
				var second = date.getSeconds();
				if(state == 1) {
					return year + "-" + formatTen(month) + "-" + formatTen(day);
				} else {
					return year + "-" + formatTen(month) + "-" + formatTen(day) + " " + formatTen(hour) + ":" + formatTen(minute);
				}

			}
			return formatDate(dateValue)
		};
		//弹框
		/* 例子:
		this.popup('XXXX?').then(res => {
			
		}).catch(() => {

		})
		*/
		Vue.prototype.popup = function(data) {
			return this.$confirm(data, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
		};
		//非空的公共方法
		Vue.prototype.noNull = function(val) {
			if(val == "" || val == null || val == "null" || typeof(val) == "undefined") {
				return true
			} else {
				return false
			}
		};
		//获取当前时间
		Vue.prototype.getTimeNow = function() {
			return new Date().getFullYear() +
				"-" +
				(new Date().getMonth() + 1) +
				"-" +
				new Date().getDate() +
				" " +
				this.appendZero(new Date().getHours()) +
				":" +
				this.appendZero(new Date().getMinutes()) +
				":" +
				this.appendZero(new Date().getSeconds())
		};
		//时间戳转正常格式
		Vue.prototype.conversionTime = function(youData) {
			var time = new Date(youData)
			var year = time.getFullYear(); //取得4位数的年份
			var month = time.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
			var date = time.getDate(); //返回日期月份中的天数（1到31）
			var hour = time.getHours(); //返回日期中的小时数（0到23）
			var minute = time.getMinutes(); //返回日期中的分钟数（0到59）
			var second = time.getSeconds(); //返回日期中的秒数（0到59）
			if(month.toString().length == 1) {
				month = '0' + month
			}
			if(date.toString().length == 1) {
				date = '0' + date
			}
			return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
		};
		//时间戳转正常格式(干掉时分秒)
		Vue.prototype.conversionTime2 = function(youData) {
			var time = new Date(youData)
			var year = time.getFullYear(); //取得4位数的年份
			var month = time.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
			var date = time.getDate(); //返回日期月份中的天数（1到31）
			var hour = time.getHours(); //返回日期中的小时数（0到23）
			var minute = time.getMinutes(); //返回日期中的分钟数（0到59）
			var second = time.getSeconds(); //返回日期中的秒数（0到59）
			if(month.toString().length == 1) {
				month = '0' + month
			}
			if(date.toString().length == 1) {
				date = '0' + date
			}
			return year + "-" + month + "-" + date
		};
		//对象非空
		Vue.prototype.noObject = function(val) {
			if(JSON.stringify(val) == "{}") {
				return true
			} else {
				return false
			}
		};

		//后台返回值
		Vue.prototype.dataBack = function(data, val) {
			console.log(data)
			if(data.status == 200 && data.data.code == 0) {
				if(data.data.data == "") {
					this.goOut("返回数据为空")
					return false
				} else {
					if(typeof(val) != "undefined" && val != "") {
						this.goOk(val)
					}
					return true
				}
			} else {
				this.goOut(data.data.msg)
				return false
			}
		};
		//下载公共方法(对象,名字)
		Vue.prototype.downloadContext = function(item, name) {
			this.$http.post("/report/export", item, {
				responseType: 'blob'
			}).then(data => {
				const content = data;
				const blob = new Blob([content], {
					type: 'application/ms-excel'
				});
				const fileName = name + '.xlsx';
				var userAgent = navigator.userAgent;
				if('download' in document.createElement('a')) { // 非IE下载
					if(userAgent.indexOf("Edge") != -1) {
						navigator.msSaveBlob(blob, fileName);
					} else {
						const elink = document.createElement('a');
						elink.download = fileName;
						elink.style.display = 'none';
						elink.href = URL.createObjectURL(blob);
						document.body.appendChild(elink);
						elink.click();
						URL.revokeObjectURL(elink.href); // 释放URL 对象
						document.body.removeChild(elink);
					}
				} else { // IE10+下载
					navigator.msSaveBlob(blob, fileName);
				}
			}).catch(function(error) {
				console.log(error);
			});
		};
	}
}