#include <iostream>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main()
{
	int min, max, dim,itr;
	float prec = 1;
	srand(time(NULL));
    cout << "Prosze wprowadzic wartosc minimalna przedialu danych: ";
	cin >> min;
	cout << "Prosze wprowadzic wartosc maksymalna przedialu danych: ";
	cin >> max;
	cout << "Prosze wprowadzic wartosc precyzji danych (np: 10, 1, 0.1, 0.0., 0.001): ";
	cin >> prec;
	cout << "Prosze wprowadzic ilosc iteracji danych: ";
	cin >> itr;
	cout << "Prosze wprowadzic ilosc parametrow pojedynczej iteracji danych (ilosc wymiarow danych 1 - 3 ): ";
	cin >> dim;
	while (dim != 1 && dim != 2 && dim != 3)
	{
		cout << "bledny agrument, zakres prawidlowy 1 - 3 ! \n";
		cout << "Proszę wprowadzic ilośc parametrów pojedynczej iteracji danych (ilosc wymiarow danych 1 - 3 ): ";
		cin >> dim;
	}
	//string XMLcontent = "<?xml version="+1.0+"encoding="+"iso - 8859 - 2"+" ?><Dane>";
	string XMLcontent = "<?xml version=";
	XMLcontent += '"';
	XMLcontent += to_string(1.0);
	XMLcontent += '"';
	XMLcontent += ' ';
	XMLcontent += "encoding=";
	XMLcontent += '"';
	XMLcontent += "iso-8859-2";
	XMLcontent += '"';
	XMLcontent += ' ';
	XMLcontent += " ?><Dane>";
	int pull = (max - min)/prec;
	int X, Y, Z;
	for (int i = 0; i < itr; i++)
	{
		string line = "<dana>";
		X = rand() % pull;
		X += min;
		X = X * prec;
		line += "<X>"+to_string(X)+"</X>";
		if (dim >= 2)
		{
			Y = rand() % pull;
			Y += min;
			Y = Y * prec;
			line += "<Y>" + to_string(Y) + "</Y>";
		}
		if (dim == 3)
		{
			Z = rand() % pull;
			Z += min;
			Z = Z * prec;
			line += "<Z>" + to_string(Z) + "</Z>";
		}
		line += "</dana>";
		XMLcontent += line;
	}
	XMLcontent += "</Dane>";

	string filesName = "data_" + to_string(min) + "-" + to_string(max) + "_x" + to_string(itr) + "_d" + to_string(dim) + ".xml";
	ofstream dataFiles(filesName);
	dataFiles << XMLcontent;
	dataFiles.close();
	cout << "Plik XML o nazwie: ";
	cout<< filesName;
	cout<<" wygenerowany pomyslnie.\n";
	return 0;
}