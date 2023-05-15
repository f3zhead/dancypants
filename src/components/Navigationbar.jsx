import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Image, Stack} from '@chakra-ui/react'
import Logo from '../assets/logo.svg'

const Navigationbar = () => {
  return (
    <Breadcrumb fontWeight='medium' fontSize='6xl'>
      <BreadcrumbItem isCurrentPage>
        <Stack direction='row'>
          <Image src={Logo} alt='Dan Abramov' boxSize='100px'/>
          <BreadcrumbLink href='/'>Dancypants</BreadcrumbLink>
        </Stack>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default Navigationbar;