function downloadPDF() {
    const pdf = new jsPDF();
    const elements = document.getElementsByTagName("img");
    const length = elements.length;
    let first = true;
    for (let i = 0; i < length; ++i) {
        let img = elements[i];
        if (!/^blob:/.test(img.src)) {
            continue;
        }
        if (first) {
            first = false;
        } else {
            pdf.addPage();
        }
        let can = document.createElement('canvas');
        let con = can.getContext("2d");
        can.width = img.width;
        can.height = img.height;
        con.drawImage(img, 0, 0, img.width, img.height);
        let imgData = can.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0);
    }
    pdf.save("download.pdf");
}
downloadPDF();
