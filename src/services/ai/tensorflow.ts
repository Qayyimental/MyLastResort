import * as tf from '@tensorflow/tfjs';

export class TensorFlowService {
    async createTimeSeriesModel(inputShape: number): tf.Sequential {
        const model = tf.sequential();
        
        model.add(tf.layers.lstm({
            units: 50,
            returnSequences: true,
            inputShape: [inputShape, 1]
        }));
        
        model.add(tf.layers.dense({ units: 1 }));
        
        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError'
        });
        
        return model;
    }

    async trainModel(model: tf.Sequential, data: number[][], labels: number[][], epochs: number = 100): Promise<void> {
        const xs = tf.tensor3d(data, [data.length, data[0].length, 1]);
        const ys = tf.tensor2d(labels, [labels.length, 1]);

        await model.fit(xs, ys, {
            epochs: epochs,
            validationSplit: 0.1,
            shuffle: true
        });
    }

    async predict(model: tf.Sequential, inputData: number[][]): Promise<number[]> {
        const input = tf.tensor3d(inputData, [inputData.length, inputData[0].length, 1]);
        const prediction = model.predict(input) as tf.Tensor;
        return Array.from(prediction.dataSync());
    }
}