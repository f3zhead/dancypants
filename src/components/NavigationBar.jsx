import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Image, Stack, Center } from '@chakra-ui/react'
import Logo from '../assets/logo.png'

const NavigationBar = () => {
  return (
    <Center>
      <Breadcrumb fontWeight='medium' fontSize='6xl'>
        <BreadcrumbItem isCurrentPage>
          <Stack direction='row'>
            <Image src={Logo} alt='Dan Abramov' boxSize='100px' />
            <BreadcrumbLink href='/'>Dancypants</BreadcrumbLink>
          </Stack>
        </BreadcrumbItem>
      </Breadcrumb>
    </Center>
  );
};

export default NavigationBar;
