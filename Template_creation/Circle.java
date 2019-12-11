package sketch;

class Circle{
	public static void main(String[] args) {
		int r=50;
		for(int a=0;a<360;a=a+2) {
			int x=(int)(60+r*Math.cos(((Math.PI)/180)*a));
			int y=(int)(60+r*Math.sin(((Math.PI)/180)*a));
			System.out.print("new Point("+x+","+y+"),");
		}
		
	}
}