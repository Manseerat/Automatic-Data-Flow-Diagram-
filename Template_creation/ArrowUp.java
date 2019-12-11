package sketch;

public class ArrowUp {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		for(int a=1;a<=50;a=a+1) {
			System.out.print("new Point("+50+","+(100-a)+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(50-a)+","+(50+a)+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(45+a)+","+(55-a)+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(50+a)+","+(50+a)+"),");
		}
	}

}
