import { Component } from '@angular/core';
import { jsPDF } from "jspdf";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'imagecollage';


  public imageWidth: number = 105;

  async createpdf(image: HTMLInputElement) {
    // Size of A4: 210 x 297 mm
    const imageWidth = 105;
    const margin = 1;
    const secondrowOffset = 170; // 297 - average image height (127) = 170

    const doc = new jsPDF();

    if (image.files == null) {
      return;
    }

    const files = Array.from(image.files);

    for (let i = 0; i < files.length; i += 4) {
      var page = doc;

      const chunk = files.slice(i, i + 4);
      const file1 = chunk[0];
      const file2 = chunk[1];
      const file3 = chunk[2];
      const file4 = chunk[3];

      if ((file1 instanceof File)) {
        await this.addImageToDocument(page, file1, 0, 0, imageWidth - (margin / 2));
      }
      if ((file2 instanceof File)) {
        await this.addImageToDocument(page, file2, imageWidth + margin, 0, imageWidth - (margin / 2));
      }
      if ((file3 instanceof File)) {
        await this.addImageToDocument(page, file3, 0, secondrowOffset, imageWidth - (margin / 2));
      }
      if ((file4 instanceof File)) {
        await this.addImageToDocument(page, file4, imageWidth + margin, secondrowOffset, imageWidth - (margin / 2));
      }

      await Promise.resolve();

      if (files.length > i + 4) {
        console.log(`${files.length} > ${i + 4}`)
        doc.addPage();
      }
    }
    await Promise.resolve();

    doc.save("collage.pdf");
  }

  async addImageToDocument(doc: jsPDF, image: File, x: number, y: number, w: number) {
    const mimeType = image.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const result = await this.getDataUrl(image);

    // Calculate height
    const fakeImage = new Image();
    fakeImage.src = result;
    const totalW = fakeImage.width;
    var currentH = fakeImage.height;

    currentH = w / totalW * currentH;

    doc.addImage(result, 'JPEG', x, y, w, currentH);
  }

  getDataUrl(file: File): Promise<string> {
    return new Promise((suc, rej) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          suc(reader.result);
        } else {
          rej();
        }

      };
      reader.readAsDataURL(file);
    });
  }

  onFileSelected(targetElement: HTMLElement, fileElement: any) {
    targetElement.innerHTML = "";

    if (!(fileElement instanceof HTMLInputElement)) {
      return;
    }

    const files = (fileElement as HTMLInputElement).files;

    if (files == null) {
      return;
    }

    for (let index = 0; index < files.length; index++) {
      const element = files[index];

      this.getDataUrl(element).then(result => {
        const newImage = new Image();
        newImage.src = result;

        targetElement.appendChild(newImage);
      })

    }

  }
}
