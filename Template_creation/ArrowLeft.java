package sketch;

class ArrowLeft{
	public static void main(String[] args) {
		for(int a=100;a>=50;a=a-1) {
			System.out.print("new Point("+a+","+100+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(50+a)+","+(100-a)+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(55-a)+","+(95+a)+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(50+a)+","+(100+a)+"),");
		}
		
	}
}
