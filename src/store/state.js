/*所有的状态*/
/*现在需要传一个歌手的网适口 vuex顺序就是a-m-s传出*/
import {playMode} from 'common/js/config'
const state={
	singer:{},
	/*播放的状态*/
	playing:false,
	/*播放器的展开和收起*/
	fullScreen:false,
	/*播放的列表*/
	playlist:[],
	/*点开小型播放器的歌曲列表*/
	sequenceList:[],
	/*播放模式*/
	mode:playMode.sequence,
	/*当前播放的索引*/
	currentIndex:-1
}
export default state