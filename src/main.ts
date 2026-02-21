import { Plugin } from "obsidian";

export default class TaskNotesProjectColorsPlugin extends Plugin {
	private observer: MutationObserver | null = null;

	async onload() {
		this.observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node instanceof HTMLElement) {
						this.colorCards(node);
					}
				}
			}
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		// Initial pass for cards already in the DOM
		this.colorCards(document.body);
	}

	onunload() {
		this.observer?.disconnect();
		this.observer = null;

		// Clean up injected styles
		document.querySelectorAll<HTMLElement>(
			".tasknotes-plugin .task-card"
		).forEach((card) => {
			card.style.removeProperty("--project-hue");
		});
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
