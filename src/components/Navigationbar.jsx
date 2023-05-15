import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Image, Stack, Center} from '@chakra-ui/react'
import Logo from '../assets/logo.svg'

const Navigationbar = () => {
  return (
    <Center>
      <Breadcrumb fontWeight='medium' fontSize='6xl'>
        <BreadcrumbItem isCurrentPage>
          <Stack direction='row'>
            <Image src={Logo} alt='logo' boxSize='100px'/>
            <BreadcrumbLink href='/'>Dancypants</BreadcrumbLink>
          </Stack>
        </BreadcrumbItem>
      </Breadcrumb>
    </Center>
  );
};

export default Navigationbar;