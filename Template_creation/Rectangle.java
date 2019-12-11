package sketch;

class Rectangle{
	public static void main(String[] args) {
		for(int a=50;a<=100;a=a+1) {
			System.out.print("new Point("+50+","+a+"),");
		}
		for(int a=50;a<=100;a=a+1) {
			System.out.print("new Point("+a+","+100+"),");
		}
		for(int a=100;a>=50;a=a-1) {
			System.out.print("new Point("+100+","+a+"),");
		}
		for(int a=100;a>=50;a=a-1) {
			System.out.print("new Point("+a+","+50+"),");
		}
		
	}
}