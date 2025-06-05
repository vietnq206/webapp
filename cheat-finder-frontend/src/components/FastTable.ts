export class FastTable {
  private container: HTMLElement;
  private tableWrapper: HTMLElement;
  private tableBody: HTMLElement;
  private items: any[] = [];

  constructor() {
    console.log('FastTable: Constructor started');
    
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'snippets-table-container';

    // Create header
    const header = document.createElement('div');
    header.className = 'table-header';
    header.innerHTML = `
      <div class="header-cell snippet-id">Snippet ID</div>
      <div class="header-cell file-name">File Name</div>
    `;

    // Create table wrapper and body
    this.tableWrapper = document.createElement('div');
    this.tableWrapper.className = 'table-wrapper';
    
    this.tableBody = document.createElement('div');
    this.tableBody.className = 'table-body';

    // Show initial empty state
    this.showEmptyState();

    // Assemble the components
    this.tableWrapper.appendChild(header);
    this.tableWrapper.appendChild(this.tableBody);
    this.container.appendChild(this.tableWrapper);

    console.log('FastTable: Constructor completed');
  }

  private showEmptyState() {
    this.tableBody.innerHTML = '<div class="table-empty">No data available</div>';
  }

  private showLoadingState() {
    this.tableBody.innerHTML = '<div class="table-loading">Loading data...</div>';
  }

  public setData(items: any[]) {
    if (!Array.isArray(items)) {
      console.error('FastTable: Invalid items provided:', items);
      this.showEmptyState();
      return;
    }

    console.log('FastTable: Setting data', { 
      itemCount: items.length,
      firstItem: items[0],
      lastItem: items[items.length - 1] 
    });
    
    this.items = items;
    
    try {
      if (items.length === 0) {
        this.showEmptyState();
        return;
      }

      // Show loading state while building HTML
      this.showLoadingState();
      
      // Build all HTML at once using string concatenation
      let html = '';
      const len = items.length;
      
      for (let i = 0; i < len; i++) {
        const item = items[i];
        if (!item || typeof item !== 'object') {
          console.warn('FastTable: Invalid item at index', i, item);
          continue;
        }

        html += `<div class="table-row">
          <div class="cell snippet-id">${this.escapeHtml(item.snippetId)}</div>
          <div class="cell file-name">${this.escapeHtml(item.fileName)}</div>
        </div>`;

        // Log progress for large datasets
        if (i > 0 && i % 1000 === 0) {
          console.log(`FastTable: Processed ${i} items`);
        }
      }
      
      // Set innerHTML once
      this.tableBody.innerHTML = html;
      
      // Verify rendering
      const renderedRows = this.tableBody.querySelectorAll('.table-row');
      console.log('FastTable: Rendered rows:', renderedRows.length);
      
      if (renderedRows.length === 0) {
        console.warn('FastTable: No rows rendered despite having data');
        this.showEmptyState();
      }
    } catch (error) {
      console.error('FastTable: Error while rendering:', error);
      this.showEmptyState();
    }
  }

  private escapeHtml(unsafe: string): string {
    if (typeof unsafe !== 'string') {
      console.warn('FastTable: Non-string value received:', unsafe);
      return String(unsafe);
    }
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  public getContainer(): HTMLElement {
    console.log('FastTable: Getting container', {
      containerExists: !!this.container,
      childCount: this.container?.childNodes.length,
      tableBodyContent: this.tableBody?.innerHTML || 'empty'
    });
    return this.container;
  }
} 