export const cardComponent = (b: any): string => `
      <div class="bookmark-card">
          <img class="bookmark-image" src="${b.cover || "https://via.placeholder.com/100"}" alt="Bookmark Image">
          <div class="bookmark-content">
              <h3><a href="${b.url}" target="_blank">${b.title}</a></h3>
              <small>(${b.collection})</small>
              <div class="tags">
                  ${b.tags.map((tag: any) => `<span class="tag">${tag.name}</span>`).join(" ")}
              </div>
              <div class="actions">
                  <a href="/bookmarks/edit/${b.id}">Edit</a>
                  <a href="/bookmarks/delete/${b.id}" style="color: red;">Delete</a>
              </div>
          </div>
      </div>
`;
