const tipStyle = 'padding: 4px 10px; -webkit-transition: -webkit-transform 500ms ease-out, opacity 500ms ease-out; transition: transform 500ms ease-out, opacity 500ms ease-out; background-color: #000; border-radius: 4px; color: #fff;';

const Toast = {
    create() {
        const doc = document;
        const toast = doc.createDocumentFragment();
        const ele = doc.createElement('div');
        const zIndex = this.zIndex || 1000;
        ele.innerHTML = `
            <div class="toast-container"
                style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${zIndex}; background-color: rgba(0,0,0,0.5); display: none">
                <div class="toast-content-container"
                    style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%);"
                >
                    <div id="toastContent" class="toast-content" style="${tipStyle}"
                    ></div>
                </div>
            </div>
        `;

        this.toast = ele.children[0];
        toast.appendChild(this.toast);
        doc.body.appendChild(toast);
    },
    createTipContent() {
        const ele = document.createElement('div');
        const zIndex = this.zIndex || 1000;
        ele.setAttribute('style', `position: fixed; top: 50%; left: 50%; z-index: ${zIndex}; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%);`);
        ele.setAttribute('class', 'toast-content-container');
        ele.innerHTML = `
            <div id="toastContent" class="toast-content" style="${tipStyle}"
            ></div>
        `;

        return ele;
    },
    setZIndex(zIndex) {
        this.zIndex = zIndex;
        if (this.toast) {
            this.toast.style.zIndex = zIndex;
        }
    },
    show(msg, duration) {
        if (!this.toast) {
            this.create();
        }

        const toast = this.toast;
        const doc = toast.ownerDocument;
        const toastContent = doc.getElementById('toastContent');
        toastContent.innerHTML = '';
        toastContent.appendChild(doc.createTextNode(msg));
        this.playShowAnim(toastContent);
        toast.style.display = 'block';

        setTimeout(() => this.hide(), duration || 2000);
    },
    showTip(msg, duration, container) {
        const tip = this.createTipContent();
        const toastContent = tip.children[0];
        toastContent.appendChild(tip.ownerDocument.createTextNode(msg));

        if (container && typeof container.appendChild === 'function') {
            container.appendChild(tip);
        } else {
            document.body.appendChild(tip);
        }

        this.playShowAnim(toastContent);
        setTimeout(() => this.removeTip(tip, toastContent), duration || 2000);
    },
    playShowAnim(toastContent) {
        toastContent.style.transform = 'translateY(-40px)';
        toastContent.style.webkitTransform = 'translateY(-40px)';
        toastContent.style.opacity = 0;
        // force update toastContent
        const height = toastContent.offsetHeight;
        setTimeout(() => {
            toastContent.style.transform = 'translateY(0px)';
            toastContent.style.webkitTransform = 'translateY(0px)';
            toastContent.style.opacity = 1;
        });
    },
    hide() {
        const toast = this.toast;
        const doc = toast.ownerDocument;
        const toastContent = doc.getElementById('toastContent');
        this.playHideAnim(toastContent);

        const afterAnimEnd = () => {
            console.log('in after anim');
            this.toast.style.display = 'none';
        };

        this.addTransitionEndAnim(toastContent, afterAnimEnd);
    },
    removeTip(tip, toastContent) {
        this.playHideAnim(toastContent);

        const afterAnimEnd = () => {
            tip.parentElement.removeChild(tip);
        };

        this.addTransitionEndAnim(toastContent, afterAnimEnd);
    },
    addTransitionEndAnim(toastContent, afterAnimEnd) {
        if (toastContent.style.transition) {
            this.addOnceEvent(toastContent, 'transitionend', afterAnimEnd);
        } else if (toastContent.style.webkitTransition) {
            this.addOnceEvent(toastContent, 'webkitTransitionEnd', afterAnimEnd);
        } else {
            afterAnimEnd();
        }
    },
    addOnceEvent(node, evtName, callback) {
        const proxy = () => {
            node.removeEventListener(evtName, proxy);
            callback.apply(this, arguments);
        };
        node.addEventListener(evtName, proxy);
    },
    playHideAnim(toastContent) {
        toastContent.style.transform = 'translateY(10px)';
        toastContent.style.webkitTransform = 'translateY(10px)';
        toastContent.style.opacity = 0;
    }
};

export default Toast;