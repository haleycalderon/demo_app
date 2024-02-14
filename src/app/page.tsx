'use client'
import Image from "next/image";
import Example from "./heatMap"
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';

export default function Home() {
  const handleClick = () => {
    // Call the function to convert the component to PNG
    convertComponentToPng();
  };

  // Function to convert the component to PNG
  const convertComponentToPng = () => {
    const node = document.getElementById('component-container');

    // Check if the node exists
    if (node) {
      htmlToImage.toPng(node)
        .then(function (dataUrl) {
          // Once the conversion is done, trigger the download
          download(dataUrl, 'component-image.png');
        })
        .catch(function (error) {
          // Handle any errors that occur during the conversion
          console.error('Error converting to PNG:', error);
        });
    }
  };

  // Function to trigger download of the generated PNG image
  const download = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  // Function to trigger download of the generated PNG image
  // function download(dataUrl: string, filename: string): void {
  //   console.log("Entering funtion now...")
  //   if (typeof document !== 'undefined') {
  //     const a = document.createElement('a');
  //     a.href = dataUrl;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   }
  //   // Add event listener to the convert button
  //   const convertButton = document.getElementById('convert-button') as HTMLElement;
  //   const node = document.getElementById('my-node') as HTMLElement;

  //   if (convertButton && node) {
  //     convertButton.addEventListener('click', function () {
  //       // Convert the HTML element to PNG
  //       console.log("it works!")
  //       toPng(node)
  //         .then(function (dataUrl) {
  //           // Once the conversion is done, trigger the download
  //           download(dataUrl, 'ionogram.png');
  //         })
  //         .catch(function (error) {
  //           // Handle any errors that occur during the conversion
  //           console.error('Error converting to PNG:', error);
  //         });
  //     });
  //   } else {
  //     console.error('Element not found.');
  //   }
  // }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="bg-white dark:bg-gray-900 w-full">
        <div id="component-container" className="py-8 px-4 max-w-screen-xl w-full lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
            <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Ionogram Plotting Tool</h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">This is a demo of a webapp that can read in ionogram data from a .json file and plot it.</p>
          </div>
          <div className="z-10 font-light h-screen w-full items-start gap-2 justify-between text-sm lg:flex flex-col">
            <ParentSize>{({ width, height }) => <Example width={width} height={height} />}</ParentSize>
            <button onClick={handleClick} type="button" className="text-black bg-gray-100 w-40 hover:bg-gray-200 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Export as PNG
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>


          </div>
        </div>
      </section>
    </main>

  );
}
