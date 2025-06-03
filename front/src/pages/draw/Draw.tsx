import { useSync } from '@tldraw/sync'
import {
	AssetRecordType,
	getHashForString,
	type TLAssetStore,
	type TLBookmarkAsset,
	Tldraw,
	uniqueId,
} from 'tldraw'

import '../../draw-tools/tldraw.css'

import { components, customAssetUrls, customTools, uiOverrides } from '../../draw-tools/ui-overrides'
import { useLocation } from 'react-router'

const WORKER_URL = `${import.meta.env.VITE_BACKEND_URL}/sync`

export const Draw = () => {
	const location = useLocation();
	const roomName = location.state?.roomName;
	const store = useSync({
		// We need to know the websocket's URI...
		uri: `${WORKER_URL}/connect/${roomName}`,
		// ...and how to handle static assets like images & videos
		assets: multiplayerAssets,
	})

	return (
		<div style={{ height: '500px' }}>
			<Tldraw
				// we can pass the connected store into the Tldraw component which will handle
				// loading states & enable multiplayer UX like cursors & a presence menu
				store={store}
				onMount={(editor) => {
					// @ts-expect-error
					window.editor = editor
					// when the editor is ready, we need to register out bookmark unfurling service
					editor.registerExternalAssetHandler('url', unfurlBookmarkUrl)
				}}

				// Pass in the array of custom tool classes
				tools={customTools}
				// Pass in any overrides to the user interface
				overrides={uiOverrides}
				// Pass in the new Keybaord Shortcuts component
				components={components}
				// Used for icons
				assetUrls={customAssetUrls}
			/>
		</div>
	)
}

// How does our server handle assets like images and videos?
const multiplayerAssets: TLAssetStore = {
	// to upload an asset, we prefix it with a unique id, POST it to our worker, and return the URL
	async upload(_asset, file) {
		console.log(file);
		const id = uniqueId()

		const objectName = `${id}-${file.name}`
		const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`

		const response = await fetch(url, {
			method: 'PUT',
			body: file
		})

		if (!response.ok) {
			throw new Error(`Failed to upload asset: ${response.statusText}`)
		}

		return { src: url }
	},
	// to retrieve an asset, we can just use the same URL. you could customize this to add extra
	// auth, or to serve optimized versions / sizes of the asset.
	// JMI : Hack
	resolve(asset) {
		if (asset.props.src) {
			let targetHost = URL.parse(WORKER_URL)!;
			let url = URL.parse(asset.props.src)!;
			url.hostname = targetHost.hostname;
			url.protocol = targetHost.protocol;
			url.port = targetHost.port;
			return url.toString();
		}
		return null
	},
}

// How does our server handle bookmark unfurling?
async function unfurlBookmarkUrl({ url }: { url: string }): Promise<TLBookmarkAsset> {
	const asset: TLBookmarkAsset = {
		id: AssetRecordType.createId(getHashForString(url)),
		typeName: 'asset',
		type: 'bookmark',
		meta: {},
		props: {
			src: url,
			description: '',
			image: '',
			favicon: '',
			title: '',
		},
	}

	try {
		const response = await fetch(`${WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`)
		const data = await response.json()

		asset.props.description = data?.description ?? ''
		asset.props.image = data?.image ?? ''
		asset.props.favicon = data?.favicon ?? ''
		asset.props.title = data?.title ?? ''
	} catch (e) {
		console.error(e)
	}

	return asset
}
