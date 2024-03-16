import { CompanionPresetDefinitions } from '@companion-module/base'

export function GetPresetsList(): CompanionPresetDefinitions {
	return {
		play: {
			type: 'button',
			category: 'Transport',
			name: 'Play',
			style: {
				text: '',
				png64:
					'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfkAQUNESwiZvYWAAABr0lEQVRIx+3VMWgTURzH8e81cZA06iAujZCh4Kqgg0WhCEIRBxcHCYgEi4pTTQURBLt1EKpDEZxcJKBQHDoJIkrBIViELg4iSCiUdPBQXET9OiSmNrk0lzvH/N72eHz4vYN7fxhmmIETdG7Y/0gCcJQzjPGa1SRkF2jgHUMb1p1zTJorDThqzacedsGG7yyZS4WKe3zvfTHjpMuGLjnhSGKyBT5otcpbds0N5y0m7NkBIhadd8M1y+YToP+C/CUDJ1wydNlJMwOi20G20JwlV2244PhAZDfI1uULzrnuB6+5LzYZBW5Dj1k19IWnzUaRI3E/RftvqVFmmr1UucmuFA07eh7wkeseStGwS+6RbAJjN2epMM49PqUA29xRKkxR4wKv+JkQbGMFprnMV25TJYSohy0G2OJynKNCgScs8rG5FfVOZmNhAceZ5RQrzLDCr95cH7DFFbnKJTa5wTO+7YTFuXKe88ywn8c85HM/bCdQIMNJZjnBS67wtlm3/3SJAn/zgwJHuEiJOtd5zvc43XpWM/CWX9y07t3Bh1T0GM0xxUHeJBmj/33QDzNMgvwB/1oU2ZEH4vEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDEtMDNUMDc6MjA6MDYrMDA6MDC0edj7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAxLTAzVDA3OjIwOjA2KzAwOjAwxSRgRwAAAABJRU5ErkJggg==',
				pngalignment: 'center:center',
				size: '18',
				color: 16777215,
				bgcolor: 13056,
			},
			feedbacks: [
				{
					// TODO: feedback IDs
					feedbackId: 'playStatus',
					options: {
						// TODO: feedback options
					},
					style: {
						// TODO: feedback style
					},
				},
			],
			steps: [
				{
					down: [
						{
							// TODO: action ids
							actionId: 'play',
							options: {},
						},
					],
					up: [],
				},
			],
		},
	}
}
