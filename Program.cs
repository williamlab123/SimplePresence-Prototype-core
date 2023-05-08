using System;
using System.IO;
using System.Net;
using System.Text;

namespace ConsoleApp
{
    class Program
    {

        //         TELA DO ALUNO ---  REGISTRAR PRESENÇA ---- 
        static void Main(string[] args)
        {
            System.Console.WriteLine("SimplePresence - Test 1.0");

            string baseURL = "https://simplepresence-production.up.railway.app";
            while (true)
            {
                var request = (HttpWebRequest)WebRequest.Create(baseURL + "/verificar_chamada");
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    using (var reader = new StreamReader(response.GetResponseStream()))
                    {
                        string result = reader.ReadToEnd();
                        bool isOpen = bool.Parse(result);
                        Console.WriteLine(isOpen);

                        if (isOpen)
                        {
                            System.Console.WriteLine("A chamada está aberta!");
                            Console.WriteLine("Digite o ID do aluno:");
                            string id = Console.ReadLine();

                             request = (HttpWebRequest)WebRequest.Create(baseURL + "/registrar_presenca");
                            request.Method = "POST";

                            string postData = "id=" + id;
                            byte[] byteArray = Encoding.UTF8.GetBytes(postData);

                            request.ContentType = "application/x-www-form-urlencoded";
                            request.ContentLength = byteArray.Length;

                            using (var dataStream = request.GetRequestStream())
                            {
                                dataStream.Write(byteArray, 0, byteArray.Length);
                            }

                            try
                            {
                                using (var responsse = (HttpWebResponse)request.GetResponse())
                                {
                                    Console.WriteLine("Presença registrada");
                                }
                            }
                            catch (WebException ex)
                            {
                                using (HttpWebResponse responsee = (HttpWebResponse)ex.Response)
                                {
                                    using StreamReader streamReader = new StreamReader(response.GetResponseStream());
                                    string resulti = streamReader.ReadToEnd();
                                    Console.WriteLine(resulti);
                                }
                            }




                        }
                        else
                        {
                            System.Console.WriteLine("A chamada está fechada!");
                        }
                    }
                }
                Thread.Sleep(5000); 
            }













        }

        
    }
}

