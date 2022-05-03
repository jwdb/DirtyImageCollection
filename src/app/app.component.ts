import { Component } from '@angular/core';
import { jsPDF } from "jspdf";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'imagecollage';

  createpdf(image1: HTMLInputElement,image2: HTMLInputElement,image3: HTMLInputElement,image4: HTMLInputElement) {
    const doc = new jsPDF();
    
    const file1 = image1.files?.item(0);
    const file2 = image2.files?.item(0);
    const file3 = image3.files?.item(0);
    const file4 = image4.files?.item(0);
    
    if (!(file1 instanceof File)
     || !(file2 instanceof File)
     || !(file3 instanceof File)
     || !(file4 instanceof File)) {
      return;
    }

    const promiseFile11 = this.addImageToDocument(doc, file1, 0, 0, 105, 127);
    const promiseFile12 = this.addImageToDocument(doc, file2, 105, 0, 105, 127);
    const promiseFile13 = this.addImageToDocument(doc, file3, 0, 170, 105, 127);
    const promiseFile14 = this.addImageToDocument(doc, file4,  105, 170, 105, 127);

    Promise.all([promiseFile11, promiseFile12, promiseFile13, promiseFile14]).then(() =>
    {
      doc.save("collage.pdf");
    })
  }

  async addImageToDocument(doc : jsPDF, image: File, x : number, y: number, h: number, w: number) {
    const mimeType = image.type;
    if (mimeType.match(/image\/*/) == null) {
        return;
    }

    const result = await this.getDataUrl(image);
    doc.addImage(result, 'JPEG', x, y, h, w);
  }

  getDataUrl(file: File) : Promise<string> {
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

  onFileSelected(targetElement: HTMLImageElement, fileElement : any) {
    if (!(fileElement instanceof HTMLInputElement)) {
      return;
    }

    const files = (fileElement as HTMLInputElement).files;

    if (files == null) {
      return;
    }
    
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        return;
    }

    this.getDataUrl(files[0]).then(result => {
      targetElement.src = result;
    })
  }
}
