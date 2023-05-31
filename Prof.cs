using System;
using System.IO;
using System.Net;
using System.Text;

namespace ConsoleApp
{
    
    class Program
    {
        static void Main(string[] args)
        {
            loop:
            System.Console.WriteLine("SimplePresence - Test 1.0");
            System.Console.WriteLine("Digite [1] para iniciar a chamada");
            System.Console.WriteLine("Digite [2] para fechar a chamada");
            System.Console.WriteLine("Digite [3] para ver os alunos presentes");

            string baseURL = "https://simplepresence-production.up.railway.app";
            string input = Console.ReadLine();

            switch (input)
            {
                case "1":
                    Console.WriteLine("Iniciando chamada...");
                    HttpWebRequest iniciarChamadaRequest = (HttpWebRequest)WebRequest.Create(baseURL + "/iniciar_chamada");
                    iniciarChamadaRequest.Method = "POST";
                    try
                    {
                        using (var response = (HttpWebResponse)iniciarChamadaRequest.GetResponse())
                        {
                            Console.WriteLine("Chamada iniciada!");
                        }
                    }
                    catch (WebException ex)
                    {
                        using (HttpWebResponse response = (HttpWebResponse)ex.Response)
                        {
                            using StreamReader streamReader = new StreamReader(response.GetResponseStream());
                            string result = streamReader.ReadToEnd();
                            Console.WriteLine(result);
                        }
                    }
                  goto loop;
                    break;

                case "2":
                    Console.WriteLine("Fechando chamada...");
                    HttpWebRequest fecharChamadaRequest = (HttpWebRequest)WebRequest.Create(baseURL + "/fechar_chamada");
                    fecharChamadaRequest.Method = "POST";
                    try
                    {
                        using (var response = (HttpWebResponse)fecharChamadaRequest.GetResponse())
                        {
                            Console.WriteLine("Chamada fechada!");
                        }
                    }
                    catch (WebException ex)
                    {
                        using (HttpWebResponse response = (HttpWebResponse)ex.Response)
                        {
                            using StreamReader streamReader = new StreamReader(response.GetResponseStream());
                            string result = streamReader.ReadToEnd();
                            Console.WriteLine(result);
                        }
                    }
                     goto loop;
                    break;

                case "3":
                    Console.WriteLine("Listando alunos presentes...");
                    HttpWebRequest listarAlunosRequest = (HttpWebRequest)WebRequest.Create(baseURL + "/alunos_presentes");
                    listarAlunosRequest.Method = "GET";
                    try
                    {
                        using (var response = (HttpWebResponse)listarAlunosRequest.GetResponse())
                        {
                            using (var reader = new StreamReader(response.GetResponseStream()))
                            {
                                string result = reader.ReadToEnd();
                                Console.WriteLine(result);
                            }
                        }
                    }
                    catch (WebException ex)
                    {
                        using (HttpWebResponse response = (HttpWebResponse)ex.Response)
                        {
                            using StreamReader streamReader = new StreamReader(response.GetResponseStream());
                            string result = streamReader.ReadToEnd();
                            Console.WriteLine(result);
                        }
                    }
                     goto loop;
                    break;

                default:
                    Console.WriteLine("Opção inválida.");
                     goto loop;
                    break;
            }
        }
    }
}
