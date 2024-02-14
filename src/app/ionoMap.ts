// TODO: Create function to map json file structure to HeatmapData type
// OR.... do that on the backend while pushing to json

type HeatmapData = {
    frequency: number[];
    range: number[];
    power: number[][];
};

export type BinItem = {
    count: number;
    bin: number;
};

// Frequency is stored in bins. Frequency == bin, with BinItems holding the range and freq info
type Bin = {
    bin: number;
    bins: BinItem[];
};

// Takes a HeatmapData object/type and returns an array of bins to populate heatmap.
function convertToHeatmapBins(data: HeatmapData): Bin[] {
    const bins: Bin[] = [];

    for (let i = 0; i < data.frequency.length; i++) {
        const frequency = data.frequency[i];
        const binItems: BinItem[] = [];

        for (let j = 0; j < data.range.length; j++) {
            const range = data.range[j];
            const count = data.power[i][j];
            //const newItem: BinItem = {count, bin: range}
            //binItems.push(newItem)
            binItems.push({ count, bin: range });
        }

        bins.push({ bin: frequency, bins: binItems });
    }

    return bins;
}

// Json file copied over
// Import json file
import data from "./data.json"

// Import
const jsonData: HeatmapData = data

// const jsonData: HeatmapData = {
//     "frequency": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
//     "range": [0,10,20,30,40,50,60,70,80,90,100],
//     "power": [
//                 [10, 10, 4, 6, 4, 1, 8, 4, 4, 7, 1],
//                 [0, 6, 2, 6, 10, 5, 10, 7, 2, 8, 0],
//                 [5, 8, 2, 6, 5, 7, 1, 3, 4, 9, 2],
//                 [5, 7, 9, 10, 1, 5, 0, 10, 7, 5, 10],
//                 [3, 8, 2, 1, 7, 6, 4, 4, 8, 10, 9],
//                 [0, 8, 3, 3, 5, 2, 3, 6, 1, 2, 10],
//                 [4, 2, 10, 9, 5, 5, 5, 4, 9, 2, 4],
//                 [10, 1, 4, 9, 0, 9, 4, 7, 9, 10, 7],
//                 [7, 10, 7, 6, 8, 7, 0, 7, 3, 1, 6],
//                 [6, 10, 8, 1, 4, 9, 5, 5, 4, 10, 7],
//                 [7, 7, 3, 10, 7, 10, 0, 6, 1, 8, 6],
//                 [1, 4, 7, 5, 2, 10, 9, 6, 10, 2, 7],
//                 [1, 3, 5, 10, 5, 3, 10, 8, 2, 3, 5],
//                 [3, 8, 10, 3, 8, 5, 3, 6, 2, 9, 7],
//                 [5, 8, 4, 10, 8, 10, 5, 5, 8, 8, 8],
//                 [0, 7, 5, 3, 7, 6, 8, 2, 5, 1, 9]
//             ]
// };

const heatmapBins = convertToHeatmapBins(jsonData);
console.log(heatmapBins);

export default heatmapBins
