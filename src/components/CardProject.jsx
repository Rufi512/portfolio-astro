import { useState, useEffect } from "preact/hooks";
import imagePr from "../assets/images/project.jpeg";

const CardProject = ({
  name,
  url,
  description,
  homepageUrl,
  openGraphImageUrl,
  languages,
}) => {
  return (
    <div class="card">
      <div class="card-header">
        <img class="bg-image" src={openGraphImageUrl || imagePr.src} />
        <div class="links">
          <a href={homepageUrl} target="_blank"> <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg></a>
        <a href={url} target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg>
        </a>
        </div>
      </div>

      <div class="card-body">
        <h3>{name}</h3>
        <div class="languages">
          {languages.map((el) => (
            <span class={`${el.lang.toUpperCase()}`} style={`border:3px solid ${el.color}`}>{el.lang}</span>
          ))}
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
};

export const ProjectsList = ({token}) => {
const [projects, setProjects] = useState([]);
useEffect(() => {
    const request = async () => {

    try{
        let formattedData = [];
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            query: `
            {
                    user(login: "rufi512") {
                        pinnedItems(first: 6) {
                            totalCount
                            edges {
                                node {
                                    ... on Repository {
                                        name
                                        url
                                        description
                                        homepageUrl
                                        openGraphImageUrl
                                        languages(first: 10) {
                                            edges {
                                                node {
                                                    name
                                                    color
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            }),
        });
    
        const { data } = await response.json();
    
        formattedData = data.user.pinnedItems.edges.map((el) => {
            const repo = el.node;
            const languages = el.node.languages.edges.map((lang) => {
            return {lang: lang.node.name.toLowerCase(), color: lang.node.color}
            });
            return {
            name: repo.name,
            homepageUrl: repo.homepageUrl,
            description: repo.description,
            url: repo.url,
            openGraphImageUrl: repo.openGraphImageUrl,
            languages,
            };
        });
    
        setProjects(formattedData);
    }catch(e){
        setTimeout(()=>{
            request()
        },3000)
    }
    };
  
    request();
  }, []);

  return (
    <div class="container-cards">
      {projects.length === 0 ? (
        <div class="lds-ripple">
          <div></div>
          <div></div>
        </div>
      ) : (
        projects.map((el) => (
          <CardProject
            name={el.name}
            languages={el.languages}
            description={el.description}
            openGraphImageUrl={el.openGraphImageUrl}
            url={el.url}
            homepageUrl={el.homepageUrl}
          />
        ))
      )}
    </div>
  );
};
