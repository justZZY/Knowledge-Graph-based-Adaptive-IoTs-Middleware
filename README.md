# Knowledge-Graph-based-Adaptive-IoTs-Middleware

English | [中文文档](README_zh.md)

***
## Abstract
Internet of Things (IoTs) entity discovery plays an important role in the Industrial IoTs (IIoTs) especially with the rapidly increasing and updating of IoT sensors in the industrial environment driven by the era of industry 4.0 and intelligent manufacturing.
However, large numbers of non-smart sensors are required in the industrial environment causing the challenge on IoTs entity discovery.
Different from the smart sensor, the non-smart sensor with limited computation and communication ability is hard to be discovered and recognized actively by the traditional IoTs platforms.
Aiming at the challenge, this work proposes a novel IoTs entity discovery middleware for non-smart sensor discovery in the industrial environment.
The proposed middleware combines both sensor knowledge graph (SKG) and sensor data value to build an IoT entity discovery and recognition model.
A knowledge-data fused learning network is proposed for the model to identify the data type, function, and other information of the non-smart sensor.
At last, a prototype middleware with the discovery and recognition model is produced to implement non-smart sensor discovery.
In the experimental evaluations, the prototype middleware tests a variety of different non-smart sensors and achieves 87.5\% recognition accuracy. 
In the real-world case studies, the prototype middleware proves the feasibility and effectiveness of non-smart sensor discovery in the industrial environment.

## Sensor Knowledge Graph
Overview of Knowledge-Data fused non-smart Sensor Knowledge Graph (SKG). (1) oneM2M Base Ontology Layer contains the base ontology of IoTs. (2) Sensor Domain Ontology Layer describes the domain ontology of non-smart sensors. (3) Sensor Instance Layer saves the discovered non-smart sensor instances.

![SKG](http://43.228.77.195:8083/pic/paper/en/kg.jpg)

## Knowledge Graph based Sensor Entity Discovery IoTs Middleware
As shown in following fig, the main processes of the proposed method are divided into four steps: (1) Data values of the non-smart sensor are extracted and encoded by the proposed Heterogeneous Graph Attention Network (HGAT). (2) Existing sensor knowledge graph is represented through HGAT embedding. (3) Value features and Knowledge representations are fused by a three layers MLP neural network. (4) The new coming non-smart sensor is inferred according to the fused features.

![Model](http://43.228.77.195:8083/pic/paper/en/model.png)

## Discovery Process

[The evaluation process video](http://43.228.77.195:8083/vueDataV/#/datav)

Various sensor instances are plugged into the proposed middleware through the RS485 interface. Then, the middleware will actively scan addresses and acquire the data value from the plugged sensor. After, the sensor addresses and data values will be sent to the knowledge-data fused model to analyze and recognize the type of the sensor. If the sensor has the exactly matched pair in Sensor Knowledge Graph (SKG), the sensor is accessed by using the corresponding configurations from SKG. If the sensor is not matched in the current SKG, the corresponding knowledge will be established to form a new sensor by combing the predicted data points, addresses, data types and other information from the similar sensors in SKG.
At last, the critical indexes, such as training time, predicting time, accuracy, Kappa score, etc., are recorded for the evaluation.

![Process](http://43.228.77.195:8083/pic/paper/en/model.png)

## Dataset
The data set consists of 8 different types of sensors including thermometer, level meter, PH meter, weight meter, Carbon Monoxide meter (CM meter), Hall Current sensor (HC sensor), turbidimeter and total dissolved solids (TDS sensor).  For each type of sensor, there are 150 sensor instances, and are divided into training set, validation set and test set with 90, 30 and 30 instances relatively. The experiment is aimed to evaluate the performance of the proposed middleware on discovering and accessing the non-smart sensors from the dataset.

![Dataset](http://43.228.77.195:8083/pic/paper/en/dataset.png)

## Baseline Comparison
TT represents the training time. PT indicates predicting time. ![](http://latex.codecogs.com/svg.latex?F_1), P, and R represent ![](http://latex.codecogs.com/svg.latex?F_1) score, recall and precision relatively. ACC stands for accuracy of sensor discovery. The proposed method achieves highest ![](http://latex.codecogs.com/svg.latex?F_1) score (0.866) and ACC (0.875) for non-smart sensor discovery. 
The drawback of the proposed method is the higher time cost (TT is 48.82ms and PT is 49.93ms) for the discovery process.
However, in practice, the sensor data acquiring process normally takes 4~5 minutes to collect enough data value for predicting. Thus, ~50ms time costs for the sensor predicting do not really affect the performance.

![Result](http://43.228.77.195:8083/pic/paper/en/result.png)

## Practical Comparison
In practical comparison, the ADA of the proposed middleware is 82.50\% and the ADE is 4.7 minutes. For ADA, the proposed middleware is 30.00\% higher than untrained IoTs technicians and 7.50\% lower than trained IoTs technicians. In terms of ADE, the discovery time cost of the proposed middleware is significantly lower than untrained IoTs technicians and about 15 minutes shorter than trained IoTs technicians. 
It can be observed the proposed middleware achieves close performance to trained IoTs technicians for non-smart sensor discovery while takes significantly less time cost. 
In more detail, the time cost of the middleware is mainly consumed on the sensor data scanning and collecting (about 4 minutes). The trained IoTs technicians' cost is mainly used to check the parameters and the addresses for configuration (about 20 minutes). The untrained IoTs technicians are mainly focused on reading the sensor instructions and debugging the sensor (about 44 minutes).
![Practical](http://43.228.77.195:8083/pic/paper/en/compare.png)