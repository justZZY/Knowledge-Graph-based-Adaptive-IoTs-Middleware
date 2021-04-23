import pandas as pd
from sklearn import preprocessing, tree
from sklearn.model_selection import train_test_split, RepeatedKFold
import numpy as np
import time


# 读取数据
data = pd.read_table('data/sensor/sensor.content', sep='\s+', header=None)
x = data.iloc[:, 1:-1].values
y = data.iloc[:, -1]
y = pd.Categorical(y).codes

# 数据标准化
x = preprocessing.scale(x)

# 划分数据集（20%测试集）
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, shuffle=True)

dt = tree.DecisionTreeClassifier(criterion="entropy")

tt = time.time()
# 训练：使用k折(cv=k，这里用5折)交叉验证
kf = RepeatedKFold(n_splits=5, n_repeats=10, random_state=0)
kf_score = []
for t, v in kf.split(x_train):
    dt.fit(x_train[t], y_train[t])  # fitting
    val_score = dt.score(x_train[v], y_train[v])
    kf_score.append(val_score)

print('time: {:.5f}s'.format(time.time() - tt))

tt = time.time()
# 测试结果
accuracy_score = dt.score(x_test, y_test)
print('time: {:.5f}s'.format(time.time() - tt))

print('验证集accuracy_score: {:.4f}'.format(np.mean(kf_score)))
print("测试集accuracy_score: {:.4f}".format(accuracy_score))
