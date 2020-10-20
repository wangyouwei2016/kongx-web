import Mock from 'mockjs'
import website from '@/const/website'
export default ({ mock }) => {
    if (!mock) return;
    //获取表格数据
    Mock.mock(RegExp('/appManage/pageList' + '.*'), 'get', () => {
        let list = []
        for (let i = 0; i < 5; i++) {
            list.push(Mock.mock({
                id: '@natural(10000)',
                name: Mock.mock('@cparagraph(1, 1)'),
                username: Mock.mock('@last'),
                type: '@natural(0,3)',
                url: '@url',
                checkbox: [0, 1],
                'number|0-100': 0,
                datetime: '@date',
                'sex|0-1': 0,
                moreselect: [0, 1],
                remerk: Mock.mock('@cparagraph(1, 1)'),
                "grade": 0,
                address: Mock.mock('@cparagraph(1, 3)'),
                check: [1, 3, 4]
            }))
        }
        return {
            data: {
                totalCount: 11,
                pageSize: 10,
                items: list
            }
        }
    })
}
