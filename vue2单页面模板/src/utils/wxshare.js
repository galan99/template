import { wxShare } from '@/utils/utils'
import {Ajax} from '@/utils/api'
async function comShare () {
  const res = await Ajax('post', '/index/share-config', {
    key: 'game_box',
    cur_page_url: window.location.href
  })
  if (res.error_code === 0) {
    let shareConfig = res.data.shareConfig
    let shareSignConfig = res.data.shareSignConfig
    wxShare(
      shareSignConfig.appId,
      shareSignConfig.timestamp,
      shareSignConfig.nonceStr,
      shareSignConfig.signature,
      shareConfig
    )
  }
}
export {
  comShare
}
