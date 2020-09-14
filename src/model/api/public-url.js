import httpReqest from '../../utils/https';
import QS from 'qs';

const publicUrl = {
	// 查询公司
	getCompanyData() {
		return httpReqest.get('/api/interfaces/organization/getCompanyData');
	},
};

export default publicUrl;