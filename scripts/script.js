function generatePDF() {
    const convertPixelsToInches = (val) => val * 72 / 96;
    const elements = document.getElementsByTagName('img');
    const length = elements.length;
    let first = true;
    let pdf;
    for (let i = 0; i < length; ++i) {
        let img = elements[i];
        if (!/^blob:/.test(img.src)) {
            continue;
        }
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        if (!pdf) {
            pdf = new jsPDF({
                orientation: (height >= width) ? 'p' : 'l',
                unit: 'in',
                format: [
                    convertPixelsToInches(width),
                    convertPixelsToInches(height)
                ]
            });
        }
        if (first) {
            first = false;
        } else {
            pdf.addPage();
        }
        let can = document.createElement('canvas');
        let con = can.getContext('2d');
        can.width = width;
        can.height = height;
        con.drawImage(img, 0, 0, width, height);
        let imgData = can.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0);
    }
    pdf.save('download.pdf');
}
