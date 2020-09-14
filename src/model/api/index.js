/**
 * api接口的统一出口
 */
import myDesk from './my-desk';
import publicUrl from './public-url';
import collaborativeOffice from './collaborative-office';

// 其他模块的接口……

// 导出接口
export default {
    myDesk,
    publicUrl,
    collaborativeOffice,
};