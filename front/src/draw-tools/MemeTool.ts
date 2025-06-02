import { StateNode, toRichText, type TLTextShape } from "tldraw";

const WORKER_URL = `${import.meta.env.VITE_BACKEND_URL}/sync`

const OFFSET = 12;

export class MemeTool extends StateNode {
	static override id = 'meme-tool'

	override onEnter() {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}
	override onPointerDown() {
		const { currentPagePoint } = this.editor.inputs
		this.editor.createShape<TLTextShape>({
			type: 'text',
			x: currentPagePoint.x - OFFSET,
			y: currentPagePoint.y - OFFSET,
			props: { richText: toRichText('❤️') },
		})
	}
}