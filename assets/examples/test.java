public class AutoIncrementSample extends java.lang.Object {

    public void<init>()
    {
        AutoIncrementSample r0;
        r0 := @this: AutoIncrementSample;
        specialinvoke r0.<java.lang.Object: void <init>()>();

        return;
    }

    public void foo()
    {
        java.io.PrintStream $r0;
        AutoIncrementSample r1;
        int i1;
        
        r1 := @this: AutoIncrementSample;
        i1 = 1 + 1;
        $r0 = <java.lang.System: java.io.PrintStream out>;
        virtualinvoke $r0.<java.io.PrintStream:

    void println(int)>(i1);

        return;
    }
}
