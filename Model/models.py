import torch
import torch.nn as nn
import torch.nn.functional as F
from layers import GraphAttentionLayer, SpGraphAttentionLayer


class GAFT(nn.Module):
    def __init__(self, nsize, kgsize, nfeat, kgfeat, nhid, nclass, dropout, alpha, nheads, kgheads):
        """Full connection version of GAT."""
        super(GAFT, self).__init__()
        self.dropout = dropout

        self.sensor_attentions = [GraphAttentionLayer(nfeat, nhid, dropout=dropout, alpha=alpha, concat=True) for _ in range(nheads)]
        for i, attention in enumerate(self.sensor_attentions):
            self.add_module('attention_{}'.format(i), attention)

        self.kg_attentions = [GraphAttentionLayer(kgfeat, nhid, dropout=dropout, alpha=alpha, concat=True) for _ in range(kgheads)]
        for i, attention in enumerate(self.kg_attentions):
            self.add_module('attention_{}'.format(nheads + i), attention)

        self.sensor_out_att = GraphAttentionLayer(nhid * nheads, 128, dropout=dropout, alpha=alpha, concat=False)
        self.kg_out_att = GraphAttentionLayer(nhid * kgheads, 128, dropout=dropout, alpha=alpha, concat=False)
        self.W_kg = nn.Parameter(torch.empty(size=(nsize, kgsize)))
        self.W_kg = nn.init.xavier_uniform_(self.W_kg)
        # full connection for matching
        self.linear1 = nn.Sequential(nn.Linear(128, 64), nn.ReLU(True))
        self.linear2 = nn.Sequential(nn.Linear(64, nclass), nn.ReLU(True))

    def forward(self, x, adj_x, y, adj_y):
        # sensor features
        x = F.dropout(x, self.dropout, training=self.training)
        x = torch.cat([att(x, adj_x) for att in self.sensor_attentions], dim=1)
        x = F.dropout(x, self.dropout, training=self.training)
        x = F.elu(self.sensor_out_att(x, adj_x))
        # node features
        y = F.dropout(y, self.dropout, training=self.training)
        y = torch.cat([att(y, adj_y) for att in self.kg_attentions], dim=1)
        y = F.dropout(y, self.dropout, training=self.training)
        y = F.elu(self.kg_out_att(y, adj_y))
        y = torch.mm(self.W_kg, y)
        # matching
        x = torch.add(x, y)
        x = self.linear1(x)
        x = self.linear2(x)
        return F.log_softmax(x, dim=1)


class GAT(nn.Module):
    def __init__(self, nfeat, nhid, nclass, dropout, alpha, nheads):
        """Dense version of GAT."""
        super(GAT, self).__init__()
        self.dropout = dropout

        self.attentions = [GraphAttentionLayer(nfeat, nhid, dropout=dropout, alpha=alpha, concat=True) for _ in range(nheads)]
        for i, attention in enumerate(self.attentions):
            self.add_module('attention_{}'.format(i), attention)

        self.out_att = GraphAttentionLayer(nhid * nheads, nclass, dropout=dropout, alpha=alpha, concat=False)

    def forward(self, x, adj):
        x = F.dropout(x, self.dropout, training=self.training)
        x = torch.cat([att(x, adj) for att in self.attentions], dim=1)
        x = F.dropout(x, self.dropout, training=self.training)
        x = F.elu(self.out_att(x, adj))
        return F.log_softmax(x, dim=1)

 
class SpGAT(nn.Module):
    def __init__(self, nfeat, nhid, nclass, dropout, alpha, nheads):
        """Sparse version of GAT."""
        super(SpGAT, self).__init__()
        self.dropout = dropout

        self.attentions = [SpGraphAttentionLayer(nfeat, 
                                                 nhid, 
                                                 dropout=dropout, 
                                                 alpha=alpha, 
                                                 concat=True) for _ in range(nheads)]
        for i, attention in enumerate(self.attentions):
            self.add_module('attention_{}'.format(i), attention)

        self.out_att = SpGraphAttentionLayer(nhid * nheads, 
                                             nclass, 
                                             dropout=dropout, 
                                             alpha=alpha, 
                                             concat=False)

    def forward(self, x, adj):
        x = F.dropout(x, self.dropout, training=self.training)
        x = torch.cat([att(x, adj) for att in self.attentions], dim=1)
        x = F.dropout(x, self.dropout, training=self.training)
        x = F.elu(self.out_att(x, adj))
        return F.log_softmax(x, dim=1)

