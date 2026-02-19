from http import HTTPStatus
from dashscope import VideoSynthesis
import dashscope

# The following is the URL for the Singapore region. The URLs for different regions vary. To get the URL: https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference
dashscope.base_http_api_url = "https://dashscope-intl.aliyuncs.com/api/v1"

# If you have not configured an environment variable, replace the following line with your Model Studio API key: api_key="sk-xxx"
# The API keys for different regions vary. To get an API key: https://www.alibabacloud.com/help/en/model-studio/get-api-key
api_key = "sk-xxxxxxxxxxxx"


def sample_sync_call_t2v():
    # Call the sync API. The result is returned.
    print("please wait...")
    rsp = VideoSynthesis.call(
        api_key=api_key,
        model="wan2.6-t2v",
        prompt="Shot from a low angle, in a medium close-up, with warm tones, mixed lighting (the practical light from the desk lamp blends with the overcast light from the window), side lighting, and a central composition. In a classic detective office, wooden bookshelves are filled with old case files and ashtrays. A green desk lamp illuminates a case file spread out in the center of the desk. A fox, wearing a dark brown trench coat and a light gray fedora, sits in a leather chair, its fur crimson, its tail resting lightly on the edge, its fingers slowly turning yellowed pages. Outside, a steady drizzle falls beneath a blue sky, streaking the glass with meandering streaks. It slowly raises its head, its ears twitching slightly, its amber eyes gazing directly at the camera, its mouth clearly moving as it speaks in a smooth, cynical voice: 'The case was cold, colder than a fish in winter. But every chicken has its secrets, and I, for one, intended to find them '.",
        # audio_url="https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250929/stjqnq/fox.mp3",
        size="1280*720",
        duration=10,
        negative_prompt="",
        prompt_extend=True,
        watermark=False,
        seed=12345,
    )
    print(rsp)
    if rsp.status_code == HTTPStatus.OK:
        print(rsp.output.video_url)
    else:
        print(
            "Failed, status_code: %s, code: %s, message: %s"
            % (rsp.status_code, rsp.code, rsp.message)
        )


if __name__ == "__main__":
    sample_sync_call_t2v()
