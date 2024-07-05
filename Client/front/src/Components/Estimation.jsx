import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const Estimation = () => {
    const [numCars, setNumCars] = useState(1);
    const [typeOfWash, setTypeOfWash] = useState('interne');
    const [sizeOfCar, setSizeOfCar] = useState('small');
    const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
    const [model, setModel] = useState(null);

    const washTypeMap = { interne: 0, externe: 1, interneexterne: 2 };
    const sizeMap = { small: 0, medium: 1, large: 2 };

    const [trainingData, setTrainingData] = useState([
        [1, 0, 0],  // 1 car, interne wash, small
        [2, 1, 1],  // 2 cars, externe wash, medium
        [3, 2, 2],  // 3 cars, interneexterne wash, large
    ]);

    const [outputData, setOutputData] = useState([
        [5],  // Wait time for 1 car, interne wash, small
        [15], // Wait time for 2 cars, externe wash, medium
        [30], // Wait time for 3 cars, interneexterne wash, large
    ]);

    useEffect(() => {
        const inputTensor = tf.tensor2d(trainingData);
        const outputTensor = tf.tensor2d(outputData);

        const model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [3], units: 10, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1 }));

        model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

        const trainModel = async () => {
            await model.fit(inputTensor, outputTensor, { epochs: 100 });
            console.log('Model trained!');
            setModel(model);
        };

        trainModel();
    }, [trainingData, outputData]);

    const handleCalculate = async () => {
        if (model) {
            const inputTensor = tf.tensor2d([[numCars, washTypeMap[typeOfWash], sizeMap[sizeOfCar]]]);
            const prediction = model.predict(inputTensor);
            const waitTime = prediction.dataSync()[0];

            setEstimatedWaitTime(waitTime);
        }
    };

    const handleAddTrainingData = () => {
        const newTrainingData = [...trainingData, [numCars, washTypeMap[typeOfWash], sizeMap[sizeOfCar]]];
        const newOutputData = [...outputData, [Number(estimatedWaitTime)]]; // Ensure estimatedWaitTime is a number
        setTrainingData(newTrainingData);
        setOutputData(newOutputData);
    };

    const handleOutputDataChange = (index, value) => {
        const newOutputData = outputData.map((item, idx) =>
            idx === index ? [Number(value)] : item
        );
        setOutputData(newOutputData);
    };

    return (
        <div className='bg-gray-50 p-4 relative left-80'>
            <h1 className='font-bold text-xl text-blue-800 mb-4'>Car Wash Wait Time Calculator</h1>
            <p className='text-blue-700'>We need more data so we can estimate time.</p>
            <div className='mt-2'>
                <label className='font-semibold '>
                    Type of Wash:
                    <select value={typeOfWash} onChange={(e) => setTypeOfWash(e.target.value)} className='ml-2 rounded-xl  py-2 px-8'>
                        <option value="interne">interne</option>
                        <option value="externe">externe</option>
                        <option value="interneexterne">interneexterne</option>
                    </select>
                </label>
            </div>
            <div className='mt-2 font-semibold'>
                <label>
                    Size of Car:
                    <select value={sizeOfCar} onChange={(e) => setSizeOfCar(e.target.value)} className='ml-2 rounded-xl  py-2 px-8'>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </label>
            </div>
            <button onClick={handleCalculate} className='mt-4 bg-blue-500 text-white py-1 px-4 rounded shadow-xl'>
                Calculate Wait Time
            </button>
            <div className='mt-4 font-bold text-green-500 '>
                <h2>Estimated Wait Time: {estimatedWaitTime.toFixed(2)} minutes</h2>
            </div>
            <div className='font-semibold mt-4'>
                
                {trainingData.map((data, index) => (
                    <div key={index} className='mt-2'>
                        <span>{`Training Data ${index + 1}: Cars=${data[0]}, Wash=${Object.keys(washTypeMap)[data[1]]}, Size=${Object.keys(sizeMap)[data[2]]}`}</span>
                        <input
                            type="number"
                            value={outputData[index][0]}
                            onChange={(e) => handleOutputDataChange(index, e.target.value)}
                            className='ml-2 rounded-xl  py-2 px-8 shadow-xl'
                        />
                    </div>
                ))}
            </div>
            <div className='font-semibold mt-4'>
                <h3>Add New Training Data</h3>
                <label>
                    Wait Time for This Configuration (minutes):
                    <input
                        type="number"
                        value={estimatedWaitTime}
                        onChange={(e) => setEstimatedWaitTime(Number(e.target.value))}
                        className='ml-2 rounded-xl  py-2 px-8 shadow-xl'
                    />
                </label>
                <button onClick={handleAddTrainingData} className='ml-2 bg-green-500 text-white py-1 px-4 rounded'>
                    Add Training Data
                </button>
            </div>
        </div>
    );
};

export default Estimation;
