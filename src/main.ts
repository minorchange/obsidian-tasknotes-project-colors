import { Plugin } from "obsidian";

export default class TaskNotesProjectColorsPlugin extends Plugin {
	private observers: Map<Document, MutationObserver> = new Map();

	async onload() {
		// Observe the main window
		this.observeWindow(document);

		// Observe any future popout windows
		this.registerEvent(
			this.app.workspace.on("window-open", (workspaceWindow) => {
				this.observeWindow(workspaceWindow.doc);
			})
		);

		this.registerEvent(
			this.app.workspace.on("window-close", (workspaceWindow) => {
				const observer = this.observers.get(workspaceWindow.doc);
				if (observer) {
					observer.disconnect();
					this.observers.delete(workspaceWindow.doc);
				}
			})
		);
	}

	onunload() {
		for (const [doc, observer] of this.observers) {
			observer.disconnect();
			doc.querySelectorAll<HTMLElement>(
				".tasknotes-plugin .task-card"
			).forEach((card) => {
				card.style.removeProperty("--project-hue");
			});
		}
		this.observers.clear();
	}

	private observeWindow(doc: Document) {
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						this.colorCards(node as HTMLElement);
					}
				}
			}
		});

		observer.observe(doc.body, {
			childList: true,
			subtree: true,
		});

		this.observers.set(doc, observer);

		// Initial pass for cards already in the DOM
		this.colorCards(doc.body);
	}

	private colorCards(root: HTMLElement) {
		const links = root.querySelectorAll<HTMLElement>(
			".tasknotes-plugin .task-card__project-link[data-href]"
		);

		for (const link of links) {
			const card = link.closest<HTMLElement>(".task-card");
			if (!card || card.style.getPropertyValue("--project-hue")) continue;

			const projectName = link.getAttribute("data-href");
			if (!projectName) continue;

			const hue = this.djb2(projectName) % 360;
			card.style.setProperty("--project-hue", String(hue));
		}

		// Also handle cases where root itself is a task card
		if (root.matches?.(".task-card")) {
			const link = root.querySelector<HTMLElement>(
				".task-card__project-link[data-href]"
			);
			if (link && !root.style.getPropertyValue("--project-hue")) {
				const projectName = link.getAttribute("data-href");
				if (projectName) {
					const hue = this.djb2(projectName) % 360;
					root.style.setProperty("--project-hue", String(hue));
				}
			}
		}
	}

	private djb2(str: string): number {
		let hash = 5381;
		for (let i = 0; i < str.length; i++) {
			hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
		}
		return hash;
	}
}
