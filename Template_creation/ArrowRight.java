package sketch;

class ArrowRight{
	public static void main(String[] args) {
		for(int a=50;a<=100;a=a+1) {
			System.out.print("new Point("+a+","+100+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(100-a)+","+(100-a)+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(95+a)+","+(95+a)+"),");
		}
		for(int a=1;a<=5;a=a+1) {
			System.out.print("new Point("+(100-a)+","+(100+a)+"),");
		}
		
	}
}
