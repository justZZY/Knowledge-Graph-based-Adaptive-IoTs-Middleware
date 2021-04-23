package com.sewage.springboot.graph;

import java.io.IOException;
import java.util.TimerTask;

public class GraphUpdate extends TimerTask {

    @Override
    public void run() {
        try {
            SiteGraph siteGraph = new SiteGraph();
            System.out.println("====Graph Update");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
