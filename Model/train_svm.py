from sklearn import svm  # 导出svm
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, RepeatedKFold
from sklearn import preprocessing
from sklearn.model_selection import GridSearchCV
import time

def search_best_params():
    # 读取数据
    data = pd.read_table('data/sensor/sensor.content', sep='\s+', header=None)
    x = data.iloc[:, 1:-1].values
    y = data.iloc[:, -1]
    y = pd.Categorical(y).codes

    # 数据标准化
    x = preprocessing.scale(x)
    gridcv = GridSearchCV(svm.SVC(), cv=5, n_jobs=-1,
                          param_grid={"kernel": ('linear', 'rbf',), "C": np.logspace(0, 4, 10),
                                      "gamma": np.logspace(-3, 3, 10)})
    gridcv.fit(x, y)
    print(gridcv.best_params_, '\n', gridcv.best_score_)


seed = 0

# 读取数据
data = pd.read_table('data/sensor/sensor.content', sep='\s+', header=None)
x = data.iloc[:, 1:-1].values
y = data.iloc[:, -1]
y = pd.Categorical(y).codes

# 数据标准化
x = preprocessing.scale(x)

# 划分数据集（20%测试集）
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, shuffle=True, random_state=seed)
model = svm.SVC(kernel='rbf', gamma=10, C=10, decision_function_shape='ovr', random_state=seed)  # 实例化
tt = time.time()
# 训练：使用k折(cv=k，这里用5折)交叉验证
kf = RepeatedKFold(n_splits=5, n_repeats=10, random_state=seed)
kf_score = []
for t, v in kf.split(x_train):
    model.fit(x_train[t], y_train[t])  # fitting
    val_score = model.score(x_train[v], y_train[v])
    kf_score.append(val_score)

print('time: {:.5f}s'.format(time.time() - tt))

tt = time.time()
# 测试结果
accuracy_score = model.score(x_test, y_test)
print('time: {:.5f}s'.format(time.time() - tt))

print('验证集accuracy_score: {:.4f}'.format(np.mean(kf_score)))
print("测试集accuracy_score: {:.4f}".format(accuracy_score))
