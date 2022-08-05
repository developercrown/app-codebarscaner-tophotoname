export default class PaginatorResponse {
    constructor(
        public current_page: number = 0,
        public data: Array<any> = [],
        public first_page_url: string = "",
        public next_page_url: string = "",
        public last_page_url: string = "",
        public prev_page_url: string = "",
        public path: string = "",
        public from: number = 0,
        public to: number = 0,
        public total: number = 0,
        public per_page: number = 0,
        public last_page: number = 0,
        public links: Array<any> = []
    ){
        this.current_page = current_page
        this.data = data
        this.first_page_url = first_page_url
        this.next_page_url = next_page_url
        this.last_page_url = last_page_url
        this.prev_page_url = prev_page_url
        this.path = path
        this.from = from
        this.to = to
        this.total = total
        this.per_page = per_page
        this.last_page = last_page
        this.links = links
    }
}