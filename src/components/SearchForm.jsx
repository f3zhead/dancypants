import { Box, VStack, SimpleGrid, Card, CardBody, Image, Text, CardFooter, ButtonGroup, Input, Stack, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SearchResult({ videoData }) {
  return (
    <Link to="/play" state={videoData}>
      <Card>
        <CardBody>
          <Image src={videoData.thumbnail} />
          <Text>{videoData.title}</Text>
        </CardBody>
        <CardFooter>
          <ButtonGroup spacing={2}>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Link>
  )
}


const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState();
  const [APIData, setAPIData] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.elements.search.value;
    if (!searchValue) return;
    setSearchTerm(searchValue);
    axios.get("https://pipedapi.tokhmi.xyz/search", { params: { "q": searchValue, "filter": "music_songs" } }).then((response) => { setAPIData(response.data.items) })
  };
  return (
    <Box>
      <h1>Dancypants</h1>
      <VStack spacing={8}>
        <form className='search-form' onSubmit={handleSubmit}>
          <Stack direction='row'>
            <Input
              type='text'
              // className='form-input search-input'
              name='search'
              placeholder='Search for a song'
            />
            <Button type='submit'>
              Search
            </Button>
          </Stack>
        </form>
        <SimpleGrid columns={5} spacing={7}>
          {
            APIData.map(video =>
              (<SearchResult videoData={video} key={video.url.substring(9)} />))
          }
        </SimpleGrid>
      </VStack>
    </Box>
  );
};
export default SearchForm;
