package org.slf4j;

import org.junit.Ignore;
import org.junit.Test;

public class FindStaticLoggerBinderPathsPerfTest {

    @Test
    @Ignore
    public void test() {
        long duration = timeFindBindingSetCall();
        System.out.println(duration / (1000) + " microseconds");

        int count = 10;
        long sum = 0;
        for (int i = 0; i < count; i++) {
            sum += timeFindBindingSetCall();
        }
        System.out.println(sum / (count * 1000) + " microseconds in average");
    }

    @Test
    public void testAsync() throws InterruptedException {
        long start = System.nanoTime();
        FindPathSetThread thread = new FindPathSetThread();
        thread.start();
        long end = System.nanoTime();

        long duration = end - start;
        System.out.println(duration / (1000) + " microseconds");
        
        thread.join();
    }

    long timeFindBindingSetCall() {
        long start = System.nanoTime();

        LoggerFactory.findPossibleStaticLoggerBinderPathSet();
        long end = System.nanoTime();
        return end - start;

    }

    static class FindPathSetThread extends Thread {

        public void run() {
            long start = System.nanoTime();
            LoggerFactory.findPossibleStaticLoggerBinderPathSet();
            long end = System.nanoTime();

            System.out.println("Found set in " + (end - start)/1000 + " microseconds");

        }
    }
}
