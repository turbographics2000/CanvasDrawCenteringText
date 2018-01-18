kuromoji.builder({ dicPath: '/dict' }).build((err, tokenizer) => {
    var path = tokenizer.tokenize('すももももももももの\nうち');
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    const input = document.querySelector('#input');
    const img = document.querySelector('#img');
    const dl = document.querySelector('#dl');

    input.oninput = evt => {
        const txt = input.value;
        const path = tokenizer.tokenize(txt);
        const lineHeight = 30;
        const textAreaWidth = canvas.width - 40;
        let lines = [''];
        let lineIndex = 0;
        let maxWidth = 0;
        path.forEach(p => {
            let newLine = false;
            if (p.surface_form === '\n') {
                newLine = true;
            } else {
                lines[lineIndex] += p.surface_form;
            }
            const w = ctx.measureText(lines[lineIndex]).width;
            maxWidth = Math.max(maxWidth, w);
            if (textAreaWidth < w) {
                newLine = true;
            }
            if (newLine) {
                lines.push('');
                lineIndex++
            }
        });
        const x = (canvas.width - maxWidth) / 2;
        let y = (canvas.height - lines.length * lineHeight) / 2;
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        lines.forEach(line => {
            ctx.fillText(line, x, y);
            y += lineHeight;
        });
        canvas.toBlob(blob => {
            if (img.src) {
                const src = img.src;
                img.src = '';
                URL.revokeObjectURL(src);
            }
            dl.textContent = '画像ダウンロード';
            dl.href = img.src = URL.createObjectURL(blob);
        });

    }
});
