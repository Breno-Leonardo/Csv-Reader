import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/card/Card";
import logo from "./assets/file-document.svg";
import logoPng from "./assets/logo.png";
import iconAdd from "./assets/file-document-plus-outline.svg";
import { InputUpload } from "./components/input/InputUpload";
import { ButtonRecent } from "./components/buttons/ButtonRecent";
import InputSearch from "./components/input/InputSearch";
import { ButtonSearch } from "./components/buttons/ButtonSearch";

function App() {
  interface RecentType {
    userId: string;
    filepath: string;
    filename: string;
  }

  let count = 0;
  const [file, setFile] = useState<any>();
  const [searchValue, setSearchValue] = useState<string>();
  const [recent, setRecent] = useState<RecentType[]>();
  const [currentCsv, setCurrentCsv] = useState<string>();
  const [currentCsvData, setCurrentCsvData] = useState<any>();
  const [loadRecent, setLoadRecent] = useState<boolean>(true);

  const onFileChange = (fileChangeEvent: any) => {
    setFile(fileChangeEvent.target?.files[0]);
  };

  const onSearchClick = () => {
    if (currentCsv && currentCsv != "") {
      const getCsvData = async () => {
        await fetch(
          ` http://localhost:3000/api/users?q=${searchValue}&csvPath=${currentCsv}`,
          {
            method: "GET",
          }
        ).then((response) => {
          response.json().then((data) => {
            setCurrentCsvData(data);
          });
        });
      };
      getCsvData();
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  useEffect(() => {
    if (file) {
      const upload = async () => {
        let currentUserId = localStorage.getItem("userId");
        if (currentUserId == null) {
          currentUserId = "";
        }
        let formData = new FormData();
        formData.append("file", file);
        formData.append("userId", currentUserId);

        await fetch("http://localhost:3000/api/files", {
          method: "POST",
          body: formData,
        }).then((response) => {
          response.json().then((data) => {
            if (currentUserId != data.userId) {
              localStorage.setItem("userId", data.userId);
            }
            setCurrentCsv(data.filepath);
            setLoadRecent(true);
          });
        });
      };
      upload();
    }
  }, [file]);

  useEffect(() => {
    if (loadRecent) {
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId && currentUserId != "") {
        const getRecent = async () => {
          await fetch(
            `http://localhost:3000/api/files/recent?userId=${currentUserId}`,
            {
              method: "GET",
            }
          ).then((response) => {
            response.json().then((data) => {
              setRecent(data);
              setLoadRecent(false);
            });
          });
        };
        getRecent();
      }
    }
  }, [loadRecent]);

  useEffect(() => {
    if (currentCsv && currentCsv != "") {
      const getCsvData = async () => {
        await fetch(`http://localhost:3000/api/users?csvPath=${currentCsv}`, {
          method: "GET",
        }).then((response) => {
          response.json().then((data) => {
            setCurrentCsvData(data);
          });
        });
      };
      getCsvData();
    }
  }, [currentCsv]);

  return (
    <>
      <div className="container">
        <div className="logoBox">
          <img src={logoPng} className="logo" />
          
        </div>
        <div className="boxUpload">
          <img src={iconAdd} className="iconAdd" />
          <InputUpload onChange={onFileChange}></InputUpload>
        </div>
        <span className="boxTitles">Recentes</span>
        <div className="boxRecent">
          {recent && recent.length > 0 ? (
            recent.map((item) => {
              return (
                <ButtonRecent
                  key={count++}
                  filename={item.filename}
                  onClick={() => setCurrentCsv(item.filepath)}
                ></ButtonRecent>
              );
            })
          ) : (
            <p className="emptyInfo"> Você não possui arquivos CSV recentes</p>
          )}
        </div>
        <span className="boxTitles">Resultado</span>
        <div className="box">
          {currentCsvData ? (
            <div className="searchDiv">
              <InputSearch
                placeholder="Pesquise"
                onChange={handleSearch}
              ></InputSearch>
              <ButtonSearch
                value={searchValue}
                onClick={onSearchClick}
              ></ButtonSearch>
            </div>
          ) : (
            <></>
          )}
          <div className="boxCards">
            {currentCsvData ? (
              currentCsvData.map((item: any) => {
                return <Card key={count++} items={item}></Card>;
              })
            ) : (
              <p className="emptyInfo"> Escolha um CSV</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
