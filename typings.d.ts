interface Thread {
    _id: string;
    text: string;
    author: Author;
    parentId: string | null;
    communty: Community | null;
    createdAt: string;
    children: { author: { image: string } }[];
    isComment?: boolean;
}

interface Author {
    name: string;
    image: string;
    id: string;
}

interface Community {
    _id: string;
    name: string;
    image: string;
}
