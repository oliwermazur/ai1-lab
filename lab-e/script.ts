function createStyleLinks(): void {
    const link1: HTMLLinkElement = document.createElement('link');
    link1.id = 'style1';
    link1.rel = 'stylesheet';
    link1.href = 'style/style1.css';
    document.head.appendChild(link1);

    const link2: HTMLLinkElement = document.createElement('link');
    link2.id = 'style2';
    link2.rel = 'stylesheet';
    link2.href = 'style/style2.css';
    link2.disabled = true;
    document.head.appendChild(link2);
}

function toggleStyleSheet(): void {
    const styleSheet1: HTMLLinkElement | null = document.getElementById('style1') as HTMLLinkElement;
    const styleSheet2: HTMLLinkElement | null = document.getElementById('style2') as HTMLLinkElement;

    if (styleSheet1 && styleSheet2) {
        if (styleSheet1.disabled) {
            styleSheet1.disabled = false;
            styleSheet2.disabled = true;
        } else {
            styleSheet1.disabled = true;
            styleSheet2.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('styleToggleButton');
    if (button) {
        button.addEventListener('click', toggleStyleSheet);
    }
});

