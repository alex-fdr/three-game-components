export class HtmlScreens {
    domElements: Record<string, HTMLElement> = {};

    add(name: string) {
        const screen = document.getElementById(name);

        if (!screen) {
            throw new Error(`no element with id=${name} found`);
        }

        this.domElements[name] = screen;

        // a hack for smooth animation of display:none property
        screen.addEventListener('animationend', () => {
            if (screen.classList.contains('hiding')) {
                screen.classList.replace('hiding', 'hidden');
            }
        });
    }

    show(name: string) {
        const screen = this.getScreen(name);
        screen.classList.replace('hidden', 'shown');
    }

    hide(name: string) {
        const screen = this.getScreen(name);
        screen.classList.replace('shown', 'hiding');
    }

    getScreen(name: string) {
        const element = this.domElements[name];

        if (!element) {
            throw new Error(`no screen with id=${name} found`);
        }

        return element;
    }
}
